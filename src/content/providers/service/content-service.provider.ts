import { ProvisionDto } from '@/content/dto'

interface ContentServiceContract {
  provision(contentId: string): Promise<ProvisionDto>
}

export const ContentServiceContract = Symbol('ContentServiceContract')
