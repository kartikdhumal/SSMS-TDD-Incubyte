const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 mt-1"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </td>
        <td className="px-6 py-4 text-center">
            <div className="h-4 bg-gray-700 rounded w-full"></div>
        </td>
        <td className="px-6 py-4">
            <div className="flex justify-center gap-3">
                <div className="h-5 bg-gray-700 rounded w-10"></div>
                <div className="h-5 bg-gray-700 rounded w-16"></div>
                <div className="h-5 bg-gray-700 rounded w-12"></div>
            </div>
        </td>
    </tr>
);

export default SkeletonRow;