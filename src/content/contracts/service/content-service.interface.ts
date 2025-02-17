import { ProvisionDto } from '@/content/dto'

export interface ContentServiceContract {
  provision(contentId: string): Promise<ProvisionDto>
}
