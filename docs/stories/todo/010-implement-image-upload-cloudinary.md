# User Story 010: Implement Image Upload + Cloudinary

## 1. Title

Implement food photo upload functionality with client-side resizing and Cloudinary storage.

## 2. Goal

To allow users to upload food photos, resize them client-side to stay within Cloudinary free tier limits, and store them on Cloudinary. The image URL and public_id will be stored with diary entries.

## 3. Description

As a developer, I need to implement image upload functionality that allows users to capture or select food photos. Images should be resized client-side (max 400px width/height) before uploading to Cloudinary to stay within free tier limits. After upload, the Cloudinary URL and public_id should be available for storing with diary entries.

## 4. Technical Details

- **Cloudinary SDK:** `cloudinary-react` or direct API calls
- **Image Resizing:** Client-side using Canvas API or `browser-image-compression` library
- **Max Size:** 400px width/height, optimized for web
- **Storage:** Cloudinary free tier (25GB storage, 25GB bandwidth/month)
- **Component:** `ImageUploader.tsx` in `apps/food-diary/src/components/`
- **Upload Primitive:** Use RAC `FileTrigger` as default; `DropZone` is optional enhancement
- **Server Action:** `uploadImageToCloudinary(file)` under `apps/food-diary/src/app/actions/`
- **Data Layer Handoff:** Persist image metadata through `apps/food-diary/src/lib/firestore/*` modules

## 5. Steps to Implement

1. **Install Dependencies:**
   - In `apps/food-diary/`, install:
     ```bash
     pnpm add cloudinary
     pnpm add browser-image-compression
     ```

2. **Configure Cloudinary:**
   - Add Cloudinary environment variables to `.env.local`:
     ```
     NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```
   - Create Cloudinary account and get credentials

3. **Create Image Upload Server Action:**
   - Create an action folder, e.g. `apps/food-diary/src/app/actions/upload-image/index.ts`
   - Export `uploadImageToCloudinary(file)` from that folder:
     ```typescript
     "use server";
     
     import { v2 as cloudinary } from 'cloudinary';
     
     cloudinary.config({
       cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
       api_key: process.env.CLOUDINARY_API_KEY,
       api_secret: process.env.CLOUDINARY_API_SECRET,
     });
     
     export async function uploadImageToCloudinary(file: File) {
       try {
         const bytes = await file.arrayBuffer();
         const buffer = Buffer.from(bytes);
         
         const result = await new Promise((resolve, reject) => {
           cloudinary.uploader.upload_stream(
             {
               folder: 'food-diary',
               transformation: [{ width: 400, height: 400, crop: 'limit' }],
             },
             (error, result) => {
               if (error) reject(error);
               else resolve(result);
             }
           ).end(buffer);
         });
         
         return {
           imageUrl: result.secure_url,
           imagePublicId: result.public_id,
         };
       } catch (error) {
         console.error('Error uploading image:', error);
         throw error;
       }
     }
     ```

4. **Create Image Uploader Component:**
   - Create `apps/food-diary/src/components/ImageUploader.tsx`
   - Add `"use client"` directive
   - Use `useState` for image preview and upload state
   - Implement image picking with RAC `FileTrigger` (camera/gallery support on mobile)
   - Optionally add RAC `DropZone` for drag-and-drop desktop UX
   - Add image preview display

5. **Implement Client-Side Image Resizing:**
   - In `ImageUploader.tsx`, before upload:
     ```typescript
     import imageCompression from 'browser-image-compression';
     
     const resizeImage = async (file: File): Promise<File> => {
       const options = {
         maxSizeMB: 1,
         maxWidthOrHeight: 400,
         useWebWorker: true,
       };
       return await imageCompression(file, options);
     };
     ```

6. **Integrate with EntryForm:**
   - In `EntryForm.tsx`, add `ImageUploader` component
   - Add state for `imageUrl` and `imagePublicId`
   - Handle image upload on form submission
   - Display image preview in form
   - Ensure final payload is validated in server action with Zod schema from `apps/food-diary/src/lib/firestore/schemas.ts`

7. **Add Image Upload UI:**
   - Add `FileTrigger` button (camera icon for mobile)
   - Add optional `DropZone` area for desktop
   - Show image preview after selection
   - Add remove image button
   - Show upload progress/loading state
   - Display error messages if upload fails

8. **Add Translations:**
   - Update `nl.json` and `en.json`:
     ```json
     {
       "entryForm": {
         "uploadImage": "Upload Food Photo",
         "removeImage": "Remove Image",
         "imageUploading": "Uploading...",
         "imageUploadError": "Failed to upload image"
       }
     }
     ```

9. **Handle Image Removal:**
   - Allow users to remove uploaded image
   - Clear image preview and state
   - Optionally delete from Cloudinary (or leave for now)

10. **Connect to Firestore Save Flow:**
    - Ensure uploaded `imageUrl` and `imagePublicId` flow into diary entry payload
    - Persist diary entry through Firestore helpers/converters under `apps/food-diary/src/lib/firestore/`

11. **Test Image Upload:**
    - Test file selection from device
    - Test RAC `FileTrigger` flow and keyboard accessibility
    - If implemented, test drag-and-drop `DropZone`
    - Test camera capture on mobile
    - Verify image is resized before upload
    - Verify upload to Cloudinary works
    - Verify image URL is returned correctly
    - Test error handling for failed uploads

## 6. Acceptance Criteria

- `cloudinary` and `browser-image-compression` packages installed
- Cloudinary environment variables configured
- `uploadImageToCloudinary` server action created and functional
- `ImageUploader` component created with RAC `FileTrigger` and preview
- `DropZone` support documented as optional enhancement
- Client-side image resizing implemented (max 400px)
- Image upload works correctly to Cloudinary
- Image URL and public_id are returned from server action
- Image metadata handoff to Firestore save flow is documented via `src/lib/firestore/*`
- Image preview displays in form
- Image can be removed from form
- Translations added for image upload UI
- Error handling implemented for upload failures
- Images are stored in Cloudinary 'food-diary' folder

## 7. Notes

- Image resizing happens client-side to reduce upload size and stay within free tier
- Cloudinary free tier allows 25GB storage and 25GB bandwidth per month
- Consider adding image optimization settings in Cloudinary upload options
- Mobile devices should support camera capture via RAC `FileTrigger`
- Image deletion from Cloudinary can be implemented later if needed
- Store both `imageUrl` and `imagePublicId` for potential future image management
