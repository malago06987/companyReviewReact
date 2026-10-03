import { getAssetUrl } from '../api'

function ReviewCard({ review }) {
  if (!review) {
    return null
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      {/* User */}
      <div className="flex items-center gap-3">

        {review.user?.profile_image ? (
          <img
            src={getAssetUrl(review.user.profile_image)}
            alt={review.user.full_name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500">
            👤
          </div>
        )}

        <div>
          <h3 className="font-semibold text-gray-900">
            {review.user?.full_name || 'ผู้ใช้งาน'}
          </h3>

          <p className="text-sm text-gray-500">
            {review.created_at
              ? new Date(review.created_at).toLocaleDateString('th-TH')
              : ''}
          </p>
        </div>

      </div>


      {/* Rating */}
      <div className="mt-5 grid grid-cols-2 gap-3">

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">
            ชีวิตดี
          </p>

          <p className="mt-1 font-semibold">
            ★ {review.rating_life ?? 0}
          </p>
        </div>


        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">
            งานดี
          </p>

          <p className="mt-1 font-semibold">
            ★ {review.rating_work ?? 0}
          </p>
        </div>


        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">
            เงินดี
          </p>

          <p className="mt-1 font-semibold">
            ★ {review.rating_money ?? 0}
          </p>
        </div>


        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-500">
            สังคมดี
          </p>

          <p className="mt-1 font-semibold">
            ★ {review.rating_society ?? 0}
          </p>
        </div>

      </div>


      {/* Review Text */}
      {review.review_text && (
        <div className="mt-5">
          <p className="whitespace-pre-line text-sm leading-6 text-gray-700">
            {review.review_text}
          </p>
        </div>
      )}

    </div>
  )
}

export default ReviewCard