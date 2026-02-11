# User Story 015: Cloudinary + Gemini End-to-End Flow

## 1. Title

Deliver the complete food-photo-to-entry flow using Cloudinary upload and
Gemini analysis.

## 2. Goal

Ensure users can upload a food photo, optionally run AI analysis, and save
the final diary entry with image metadata and quota enforcement.

## 3. Description

As a user, I want to upload a food photo and get optional AI help filling in
entry details, so I can log entries faster while keeping full control over
the final saved data.

## 4. Scope

- Integrate story 010 and story 011 work into one production flow.
- Add UX states for analysis success, analysis failure, and daily limit reached.
- Ensure entry save still works when analysis is skipped or unavailable.
- Persist `imageUrl` and `imagePublicId` with saved entries when available.

## 5. Dependencies

- `docs/stories/010-implement-image-upload-cloudinary.md`
- `docs/stories/011-implement-gemini-food-analysis.md`
- Firestore schema and helpers in `apps/food-diary/src/lib/firestore/`

## 6. Technical Notes

- Use server actions under `apps/food-diary/src/app/actions/`.
- Keep analysis quota enforced in Firestore (`userAnalysisQuota`).
- Do not block manual entry when upload or analysis fails.
- Return typed, user-safe error states for UI rendering.

## 7. Acceptance Criteria

- User can select a photo and upload it to Cloudinary.
- Uploaded image preview is shown in the entry form.
- User can request AI analysis for uploaded image.
- Gemini response can prefill supported fields in the form.
- If daily limit is reached, user sees a clear message and can continue manually.
- If Gemini fails, user can continue and still save entry manually.
- Saved entries include image metadata when upload succeeded.
- No regressions in guest and authenticated entry save flows.
