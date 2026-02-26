import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Giveaway: 'bg-green-100 text-green-800',
  Lend: 'bg-blue-100 text-blue-800',
  Trade: 'bg-orange-100 text-orange-800',
};

const STATUS_COLORS = {
  Available: 'bg-emerald-500',
  Pending: 'bg-yellow-500',
  Gifted: 'bg-gray-400',
};

const ItemCard = ({ item }) => {
  const imageUrl = item.image
    ? item.image.startsWith('http')
      ? item.image
      : `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/uploads/${item.image}`
    : null;

  return (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col ${
      !item.isApproved ? 'opacity-75 border-2 border-yellow-400' : ''
    }`}>

      {/* Pending Approval Banner */}
      {!item.isApproved && (
        <div className="bg-yellow-400 text-yellow-900 text-xs font-bold text-center py-1.5 px-3 flex items-center justify-center gap-1">
          ⏳ Waiting for Admin Approval
        </div>
      )}

      {/* Image */}
      <div className="h-48 bg-gray-100 relative">
        {imageUrl ? (
          <img
            src={imageUrl} alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            📦
          </div>
        )}

        {/* Status Badge - top right */}
        <span className={`absolute top-2 right-2 text-white text-xs px-2 py-1 rounded-full ${STATUS_COLORS[item.status]}`}>
          {item.status}
        </span>

        {/* Category Badge - top left */}
        <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[item.category]}`}>
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-1">
          {item.title}
        </h3>

        <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>

        {/* Price tag - only for Lend items */}
        {item.category === 'Lend' && (
          <div className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-lg w-fit ${
            item.price > 0
              ? 'bg-blue-50 text-blue-700'
              : 'bg-green-50 text-green-700'
          }`}>
            {item.price > 0 ? `₹${item.price}/day` : '🆓 Free Lend'}
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-3 text-sm mt-auto pt-2 border-t border-gray-100">
          <span title="Sustainability Rating">
            {'⭐'.repeat(item.sustainabilityRating)}
          </span>
          <span className="text-green-600 font-medium">
            🌱 {item.estimatedCO2Saved}kg
          </span>
          <span className="text-gray-400 text-xs ml-auto truncate">
            {item.owner?.name}
          </span>
        </div>

        {/* Approval pending — no view button */}
        {!item.isApproved ? (
  <div className="mt-2 flex flex-col gap-2">
    <div className="text-center bg-yellow-50 text-yellow-700 py-2 rounded-lg text-sm font-medium border border-yellow-200">
      🔒 Pending Admin Review
    </div>
    <Link
      to={`/item/${item._id}`}
      className="text-center bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
    >
      👁️ Preview My Listing
    </Link>
  </div>
) : (
  <Link
    to={`/item/${item._id}`}
    className="mt-2 text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
  >
    View Details
  </Link>
)}
      </div>
    </div>
  );
};

export default ItemCard;