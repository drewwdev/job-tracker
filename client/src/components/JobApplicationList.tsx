import { Link } from "react-router-dom";
import { z } from "zod";
import { jobApplicationListSchema } from "../../../shared/schemas/jobApplication";

type JobApplication = z.infer<typeof jobApplicationListSchema>[number];

type Props = {
  applications: JobApplication[];
};

export default function JobApplicationList({ applications }: Props) {
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
                    key={tag.name}
                    className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${tag.color_class}`}>
                    {tag.name}
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
