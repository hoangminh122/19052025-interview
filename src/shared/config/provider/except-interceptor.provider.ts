import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core"
import { BlackListInterceptor } from "../../interceptor/black-list.interceptor"
import { HttpExceptionFilter } from "../../interceptor/http-except.interceptor"

const blackListInterceptor = {
    provide: APP_INTERCEPTOR,
    useClass: BlackListInterceptor,
}

const httpExceptionFilter = {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
}

export {
    blackListInterceptor,
    httpExceptionFilter
}
