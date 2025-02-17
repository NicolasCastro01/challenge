import { ProvisionDto } from '@/content/dto'

export interface Provisioner {
  provision(): ProvisionDto
}
