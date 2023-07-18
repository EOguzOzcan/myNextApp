"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
const supabase = createClientComponentClient()

export async function getSignedUrls() {
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

export async function getUser() {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw error
  }
  const session = data?.session ?? null
  return { session }
}

export async function signOut() {
  await supabase.auth.signOut()
  return { success: true }
}
