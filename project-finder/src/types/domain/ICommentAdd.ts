export interface ICommentAdd {
	projectId: string,
	content: string,
	replyToCommentId: string | null,
}
