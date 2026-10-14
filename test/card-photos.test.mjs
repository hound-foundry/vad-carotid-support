import test from "node:test";
import assert from "node:assert/strict";
import { createCardStore, coordinateCardClearing } from "../src/features/cards/storage.mjs";
import { emptyPersonalCard, emptyMilestoneCard, PERSONAL_CARD_KEY, MILESTONE_CARD_KEY, parsePersonalCard } from "../src/features/cards/model.mjs";
import { clearProjectData, registerLocalDataResource } from "../src/features/local-data/keys.mjs";
import { validPhotoAsset, normalisePhoto, PHOTO_MAX_BYTES } from "../src/features/cards/photos.mjs";
const a = "photo-" + "a".repeat(32), b = "photo-" + "b".repeat(32);
const asset = id => ({ id, blob: new Blob([new Uint8Array([255, 216, 255, 217])], { type: "image/jpeg" }), width: 100, height: 100 });
function fixture() { const data = new Map(), images = new Map(); const adapter = { getItem: async (k) => data.get(k) || null, setItem: async (k, v) => { data.set(k, v); }, removeItem: async (k) => { data.delete(k); } }; const photos = { get: async (id, owner) => { const v = images.get(id); if (v && v.owner !== owner)
        throw Error("Wrong owner"); return v?.photo || null; }, put: async (photo, owner) => { images.set(photo.id, { photo, owner }); }, remove: async (id, owner) => { if (images.get(id)?.owner === owner)
        images.delete(id); }, removeOwner: async (owner) => { for (const [id, v] of images)
        if (v.owner === owner)
            images.delete(id); }, clear: async () => { images.clear(); } }; return { data, images, adapter, photos, personal: createCardStore(adapter, "personal", photos), milestone: createCardStore(adapter, "milestone", photos) }; }
test("selected photos are not persisted until explicit save and restore references stay out of text records", async () => {
    const f = fixture(), photo = asset(a), card = { ...emptyPersonalCard(), templateId: "portrait", photoRef: a, preferredName: "SYNTHETIC" };
    assert.equal(f.images.size, 0);
    await f.personal.save(card, photo);
    assert.equal(f.images.size, 1);
    const raw = f.data.get(PERSONAL_CARD_KEY);
    assert.equal(parsePersonalCard(raw).photoRef, a);
    assert.doesNotMatch(raw, /base64|image\/jpeg|file:\/\/|blob:/);
    assert.ok(f.images.get(a).photo.blob === photo.blob);
});
test("failed wording save removes the new photo and preserves the old complete saved card", async () => {
    const f = fixture();
    await f.personal.save({ ...emptyPersonalCard(), photoRef: a }, asset(a));
    const before = f.data.get(PERSONAL_CARD_KEY), write = f.adapter.setItem;
    f.adapter.setItem = async () => { throw Error("Quota"); };
    await assert.rejects(f.personal.save({ ...emptyPersonalCard(), photoRef: b }, asset(b)));
    assert.equal(f.data.get(PERSONAL_CARD_KEY), before);
    assert.ok(f.images.has(a));
    assert.ok(!f.images.has(b));
    f.adapter.setItem = write;
});
test("replacement deletes the retired photo while the other card's photo remains separate", async () => {
    const f = fixture();
    await f.personal.save({ ...emptyPersonalCard(), photoRef: a }, asset(a));
    await assert.rejects(f.milestone.save({ ...emptyMilestoneCard(), photoRef: a }, asset(a)));
    await f.personal.save({ ...emptyPersonalCard(), photoRef: b }, asset(b));
    assert.ok(!f.images.has(a));
    assert.ok(f.images.has(b));
    await f.milestone.save({ ...emptyMilestoneCard(), photoRef: a }, asset(a));
    await f.personal.remove();
    assert.ok(!f.data.has(PERSONAL_CARD_KEY));
    assert.ok(f.data.has(MILESTONE_CARD_KEY));
    assert.ok(f.images.has(a));
    assert.ok(!f.images.has(b));
});
test("photo cleanup failure rolls back a save rather than reporting the new card saved", async () => {
    const f = fixture();
    await f.personal.save({ ...emptyPersonalCard(), photoRef: a }, asset(a));
    const before = f.data.get(PERSONAL_CARD_KEY), remove = f.photos.remove;
    f.photos.remove = async (id, owner) => { if (id === a)
        throw Error("Database locked"); await remove(id, owner); };
    await assert.rejects(f.personal.save({ ...emptyPersonalCard(), photoRef: b }, asset(b)));
    assert.equal(f.data.get(PERSONAL_CARD_KEY), before);
    assert.ok(f.images.has(a));
    assert.ok(!f.images.has(b));
});
test("failed photo deletion restores the card record and remains retryable", async () => {
    const f = fixture();
    await f.personal.save({ ...emptyPersonalCard(), photoRef: a }, asset(a));
    const before = f.data.get(PERSONAL_CARD_KEY), remove = f.photos.removeOwner;
    f.photos.removeOwner = async () => { throw Error("Database locked"); };
    await assert.rejects(f.personal.remove());
    assert.equal(f.data.get(PERSONAL_CARD_KEY), before);
    assert.ok(f.images.has(a));
    f.photos.removeOwner = remove;
    await f.personal.remove();
    assert.equal(f.images.size, 0);
});
test("clear-all drains photo saves, blocks new writes and clears the additional blob resource", async () => {
    const f = fixture(), unsubscribe = coordinateCardClearing([f.personal, f.milestone]), unregister = registerLocalDataResource("card-photos", () => f.photos.clear());
    let release, started;
    const gate = new Promise(resolve => { release = resolve; }), putStarted = new Promise(resolve => { started = resolve; }), put = f.photos.put;
    f.photos.put = async (photo, owner) => { started(); await gate; return put(photo, owner); };
    try {
        const save = f.personal.save({ ...emptyPersonalCard(), photoRef: a }, asset(a));
        await putStarted;
        const clear = clearProjectData(f.adapter);
        await Promise.resolve();
        await Promise.resolve();
        await assert.rejects(f.milestone.save({ ...emptyMilestoneCard(), photoRef: b }, asset(b)), /cleared/);
        assert.equal(f.images.size, 0);
        release();
        await save;
        await clear;
        assert.equal(f.images.size, 0);
        assert.equal(f.data.size, 0);
    }
    finally {
        release();
        unsubscribe();
        unregister();
    }
});
test("a failed resource clear cannot report successful global deletion", async () => {
    const f = fixture(), unregister = registerLocalDataResource("card-photos", async () => { throw Error("Photo clear failed"); });
    try {
        await assert.rejects(clearProjectData(f.adapter));
    }
    finally {
        unregister();
    }
});
test("empty, oversized and unsupported photo inputs are rejected before decoding or persistence", async () => {
    assert.equal(validPhotoAsset({ ...asset(a), blob: new Blob([], { type: "image/jpeg" }) }), false);
    assert.equal(validPhotoAsset({ ...asset(a), width: 1281 }), false);
    for (const input of [new Blob(["unsupported"], { type: "image/gif" }), new Blob(["not a jpeg"], { type: "image/jpeg" }), new Blob([new Uint8Array(PHOTO_MAX_BYTES + 1)], { type: "image/jpeg" })])
        await assert.rejects(normalisePhoto(input), /previous photo is unchanged/);
});
