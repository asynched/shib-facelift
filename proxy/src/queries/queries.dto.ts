import { array, string } from 'zod'
import { createZodDto } from 'nestjs-zod'

const getRunningQueriesDto = array(string())

export class GetRunningQueriesDto extends createZodDto(getRunningQueriesDto) {}
