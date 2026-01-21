// lib/cloudinaryUpload.ts
export async function uploadToCloudinary(
  file: File,
  folder: "temple/profile" | "temple/uploads" | "temple/events" | "temple/uploads"
): Promise<string> {
  try {
    const res = await fetch("/api/cloudinary/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    })

    if (!res.ok) {
      throw new Error("Failed to get Cloudinary signature")
    }

    const { signature, timestamp, cloudName, apiKey } = await res.json()

    const formData = new FormData()
    formData.append("file", file)
    formData.append("api_key", apiKey)
    formData.append("timestamp", timestamp.toString())
    formData.append("signature", signature)
    // formData.append("folder", folder)

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload4586
      
      `,
      {
        method: "POST",
        body: formData,
      }
    )

    const data = await uploadRes.json()

    if (!uploadRes.ok) {
      console.error("[v0] Cloudinary error:", data)
      throw new Error(data.error?.message || "Upload failed")
    }

    return data.secure_url
  } catch (error) {
    console.error("[v0] Cloudinary upload failed:", error)
    throw error
  }
}
