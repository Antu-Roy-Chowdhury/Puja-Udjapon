type CloudinaryFolder =
  | "temple/profile"
  | "temple/gallery"
  | "temple/events"
  | "temple/activities"

type CloudinaryResourceType = "image" | "video" | "auto"

export async function uploadToCloudinary(
  file: File,
  folder: CloudinaryFolder,
  resourceType: CloudinaryResourceType = "auto",
): Promise<string> {
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  })

  if (!signRes.ok) {
    throw new Error("Failed to get Cloudinary signature")
  }

  const { signature, timestamp, cloudName, apiKey, folder: signedFolder } = await signRes.json()

  const formData = new FormData()
  formData.append("file", file)
  formData.append("api_key", apiKey)
  formData.append("timestamp", String(timestamp))
  formData.append("signature", signature)
  formData.append("folder", signedFolder)

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    },
  )

  const data = await uploadRes.json()

  if (!uploadRes.ok || !data.secure_url) {
    console.error("[v0] Cloudinary error:", data)
    throw new Error(data.error?.message || "Upload failed")
  }

  return data.secure_url as string
}
