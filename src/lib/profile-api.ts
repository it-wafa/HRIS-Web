import type {
  Profile,
  UpdateProfilePayload,
  UploadPhotoPayload,
  UploadPhotoResponse,
} from "@/types/profile";
import { apiCall } from "@/lib/api";

// ════════════════════════════════════════════
// PROFILE API
// ════════════════════════════════════════════

/** GET /profile — Get user profile */
export async function fetchProfile() {
  return apiCall<Profile>("/profile");
}

/** PUT /profile — Update user profile */
export async function updateProfile(
  payload: UpdateProfilePayload,
) {
  return apiCall<Profile>("/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** POST /profile/photo — Upload profile photo */
export async function uploadProfilePhoto(
  payload: UploadPhotoPayload,
) {
  return apiCall<UploadPhotoResponse>("/profile/photo", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** DELETE /profile/photo — Delete profile photo */
export async function deleteProfilePhoto() {
  return apiCall<{ message: string }>("/profile/photo", {
    method: "DELETE",
  });
}
