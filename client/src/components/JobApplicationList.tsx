import { Link } from "react-router-dom";
import { z } from "zod";
import { jobApplicationListSchema } from "../../../shared/schemas/jobApplication";

type JobApplication = z.infer<typeof jobApplicationListSchema>[number];

type Props = {
  applications: JobApplication[];
  showDemo: boolean;
};

export default function JobApplicationList({ applications, showDemo }: Props) {
  return (
    <div className="flex flex-wrap gap-4 sm:gap-6 lg:gap-8 justify-start px-4">
      {applications.map((app) => (
        <Link
          key={app.id}
          to={`/application/${app.id}`}
          className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.5rem)] xl:w-[calc(25%-0.5rem)] no-underline">
          <div className="h-full bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {app.job_title}
            </h2>

            {app.is_demo && showDemo && (
              <span className="inline-block mb-2 px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                Demo Job
              </span>
            )}

            <p className="text-sm text-gray-700 mb-1">
              <span className="block font-medium text-gray-900">Company:</span>
              {app.company_name}
            </p>

            <p className="text-sm text-gray-700 mb-1">
              <span className="block font-medium text-gray-900">Location:</span>
              {app.location}
            </p>

            <p className="text-sm text-gray-700 mb-1">
              <span className="block font-medium text-gray-900">Status:</span>
              {app.application_status}
            </p>

            <p className="text-sm text-gray-700 mb-2">
              <span className="block font-medium text-gray-900">
                Applied on:
              </span>
              {new Date(app.applied_date).toLocaleDateString()}
            </p>

            {(app.tags ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
