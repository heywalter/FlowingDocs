import { useCallback, useMemo } from 'react'
import { translate } from '@docusaurus/Translate'
import {
  usePluralForm,
  useQueryString,
  useQueryStringList,
} from '@docusaurus/theme-common'
import type { TagType, ProjectShowcase } from '@site/data/showcase'
import { sortedShowcase } from '@site/data/showcase'

export function useSearchName() {
  return useQueryString('name')
}

export function useTags() {
  return useQueryStringList('tags')
}

type Operator = 'OR' | 'AND'

export function useOperator() {
  const [searchOperator, setSearchOperator] = useQueryString('operator')
  const operator: Operator = searchOperator === 'AND' ? 'AND' : 'OR'
  const toggleOperator = useCallback(() => {
    const newOperator = operator === 'OR' ? 'AND' : null
    setSearchOperator(newOperator)
  }, [operator, setSearchOperator])
  return [operator, toggleOperator] as const
}

function filterProjects({
  projects,
  tags,
  operator,
  searchName,
}: {
  projects: ProjectShowcase[]
  tags: TagType[]
  operator: Operator
  searchName: string | null
}) {
  if (searchName) {
    projects = projects.filter(project =>
      project.title.toLowerCase().includes(searchName.toLowerCase()),
    )
  }
  if (tags.length === 0) {
    return projects
  }
  return projects.filter((project) => {
    if (project.tags.length === 0) {
      return false
    }
    if (operator === 'AND') {
      return tags.every(tag => project.tags.includes(tag))
    }
    return tags.some(tag => project.tags.includes(tag))
  })
}

/**
 * Filters and returns the list of projects based on name, tags, and operator.
 */
export function useFilteredProjects() {
  const [tags] = useTags()
  const [searchName] = useSearchName()
  const [operator] = useOperator()
  return useMemo(
    () =>
      filterProjects({
        projects: sortedShowcase as ProjectShowcase[],
        tags: tags as TagType[],
        operator,
        searchName,
      }),
    [tags, operator, searchName],
  )
}

export function useSiteCountPlural() {
  const { selectMessage } = usePluralForm()
  return (sitesCount: number) =>
    selectMessage(
      sitesCount,
      translate(
        {
          id: 'showcase.filters.resultCount',
          description:
            'Label for the number of sites found on the showcase. Simplified for single plural form support in zh-Hans.',
          message: '{sitesCount} 个客户案例',
        },
        { sitesCount },
      ),
    )
}
