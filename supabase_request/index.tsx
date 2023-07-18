"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export async function getSignedUrls() {
  const supabase = createClientComponentClient()

  const { data: files, error: listError } = await supabase.storage.from("boncuk").list("", {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" }
  })

  if (listError) {
    throw listError
  }

  const fileNames = files.map((file) => file.name)

  const { data: signedUrls, error: signedUrlError } = await supabase.storage
    .from("boncuk")
    .createSignedUrls(fileNames, 60)

  if (signedUrlError) {
    throw signedUrlError
  }

  const onlySignedUrls = signedUrls.map((signedUrl) => signedUrl.signedUrl)

  return { onlySignedUrls }
}
