export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">My Courses</h1>
      <div className="max-w-4xl mx-auto">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all mb-6 animate-pulse">
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 w-48 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 w-32 bg-gray-300 rounded"></div>
                </div>
                <div className="h-10 w-32 bg-gray-300 rounded"></div>
              </div>
              <div className="h-4 w-3/4 bg-gray-300 rounded mt-2"></div>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div className="h-5 w-32 bg-gray-300 rounded"></div>
              {[...Array(2)].map((_, idx) => (
                <div key={idx} className="h-20 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}