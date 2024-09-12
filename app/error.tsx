'use client' // Error boundaries must be Client Components
 
import RequireLoginError from '@/lib/error/RequireLoginError'
import Link from 'next/link'
import { useEffect } from 'react'
 
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  // alert(error);

  if (error instanceof RequireLoginError) {
    return (
      <div>
        <h2>이 페이지를 보려면 로그인해야합니다.</h2>
        <Link href='/login'>로그인</Link>
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Try again
        </button>
      </div>
    ) 
  }
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}