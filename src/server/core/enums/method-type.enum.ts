export enum MethodType {
	Listen = 'listen',
	Connection = 'connection',
	Disconnection = 'disconnection',
	Startup = 'startup',
	BeforeStartup = 'before_startup',
	Shutdown = 'shutdown',
	BeforeShutdown = 'before_shutdown',
	Message = 'message',
}