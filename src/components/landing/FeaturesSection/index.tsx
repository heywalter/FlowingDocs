import Translate from '@docusaurus/Translate'
import features from '@site/data/features'
import { Section } from '../Section'

export default function FeaturesSection() {
  return (
    <Section title={<Translate id="homepage.feature.title">个人特点</Translate>} icon="ri:map-pin-user-line">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => (
            <div
              key={i}
              className="group relative flex h-full flex-col rounded-xl border border-gray-200/60 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-gray-700/50 dark:bg-gray-900/50 dark:hover:shadow-blue-400/10"
            >
              {/* Header Image */}
              <div className="relative overflow-hidden rounded-t-xl">
                {item.header}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {item.title}
                  </h3>
                </div>

                <p className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute right-4 top-4 size-2 rounded-full bg-blue-500 opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
