"use client"
import { useEffect, useState } from "react"
import { getSignedUrls } from "../../supabase_request"

function Page() {
  const [signedUrls, setSignedUrls] = useState<string[]>([])
  useEffect(() => {
    getSignedUrls().then((data) => setSignedUrls(data.onlySignedUrls))
  }, [])

  return (
    <div>
      {signedUrls?.map((url) => (
        <img key={url} src={url} style={{ width: "200px", height: "200px" }} />
      ))}
    </div>
  )
}

export default Page
