import { Link } from 'react-router';
const JobCard = ({ job }) => {
  const dataLine = new Date(job.deadline).toLocaleString();
  
  return (
    <Link to={`/jobDetals/${job._id}`}>
      <div className="w-full max-w-sm px-4 py-3 bg-white rounded-md shadow-md dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-sm font-light text-gray-800 dark:text-gray-400">
            {' '}
            {job.category}
          </span>
          <span className="px-3 py-1 text-xs text-blue-800 uppercase bg-blue-200 rounded-full dark:bg-blue-300 dark:text-blue-900">
            psychology
          </span>
        </div>

        <div>
          <h1 className="mt-2 text-lg font-semibold text-gray-800 dark:text-white">
            {job.job_title}
          </h1>
          <p
            title={job.description}
            className="mt-2 text-sm text-gray-600 dark:text-gray-300"
          >
            {job.description.substring(0, 70)}...
          </p>
        </div>

        <div>
          <div className="flex items-center mt-2 text-gray-700 dark:text-gray-200">
            <p>deadline : {dataLine}</p>
          </div>

          <div>
            <p className="mt-2 text-sm font-bold text-gray-600">
              Range: ${job.min_price} - {job.max_price}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
