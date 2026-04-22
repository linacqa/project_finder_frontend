import { AccountContext } from "@/context/AccountContext";
import { IComment } from "@/types/domain/IComment";
import { useContext, useMemo, useState } from "react";
import {
	Heading,
	Input,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
} from "taltech-styleguide";
import ConfirmationModal from "../modal/ConfirmationModal";

interface CommentsSectionProps {
	comments: IComment[];
	newComment: string;
	setNewComment: (value: string) => void;
	onPostComment: () => void;
	onPostReply: (replyToCommentId: string, content: string) => void;
	onDelete: (commentId: string) => void;
}

interface CommentNode {
	comment: IComment;
	children: CommentNode[];
}

function formatDate(value: string) {
	return new Date(value).toLocaleDateString("et-EE", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export default function CommentsSection({
	comments,
	newComment,
	setNewComment,
	onPostComment,
	onPostReply,
	onDelete,
}: CommentsSectionProps) {
	const { accountInfo } = useContext(AccountContext);
	const [commentIdToDelete, setCommentIdToDelete] = useState<string | null>(
		null,
	);
	const [replyingToCommentId, setReplyingToCommentId] = useState<
		string | null
	>(null);
	const [replyContent, setReplyContent] = useState("");
	const commentTree = useMemo(() => {
		const nodeById = new Map<string, CommentNode>();
		const roots: CommentNode[] = [];

		for (const comment of comments) {
			nodeById.set(comment.id, { comment, children: [] });
		}

		for (const comment of comments) {
			const node = nodeById.get(comment.id);
			if (!node) continue;

			if (comment.replyToCommentId) {
				const parentNode = nodeById.get(comment.replyToCommentId);
				if (parentNode) {
					parentNode.children.push(node);
					continue;
				}
			}

			roots.push(node);
		}

		return roots;
	}, [comments]);

	const handleDeleteComment = (commentId: string) => {
		setCommentIdToDelete(null);
		onDelete(commentId);
	};

	const handlePostReply = (replyToCommentId: string) => {
		onPostReply(replyToCommentId, replyContent);
		setReplyContent("");
		setReplyingToCommentId(null);
	};

	const renderCommentNode = (node: CommentNode, depth = 0): JSX.Element => {
		const { comment, children } = node;

		return (
			<div key={comment.id} style={{ marginLeft: depth * 24 }}>
				<TTNewCard className="mb-2">
					<TTNewCardContent>
						<p>{comment.content}</p>
						<small className="text-muted">
							{comment.user.firstName} {comment.user.lastName} (
							{comment.user.email})
						</small>
						<br />
						<small className="text-muted">
							{formatDate(comment.createdAt)}
						</small>
						{comment.userId === accountInfo?.userId && (
							<TTNewButton
								variant="danger"
								size="xs"
								className="float-end"
								onClick={() => setCommentIdToDelete(comment.id)}
							>
								Kustuta
							</TTNewButton>
						)}
						<TTNewButton
							variant="tertiary"
							size="xs"
							onClick={() => {
								if (replyingToCommentId === comment.id) {
									setReplyingToCommentId(null);
									setReplyContent("");
									return;
								}

								setReplyingToCommentId(comment.id);
								setReplyContent("");
							}}
						>
							Vasta
						</TTNewButton>

						{replyingToCommentId === comment.id && (
							<div className="d-flex flex-column gap-2 mt-2">
								<Input
									as="textarea"
									placeholder="Lisa vastus"
									value={replyContent}
									onChange={(e) =>
										setReplyContent(e.target.value)
									}
								/>
								<div className="d-flex gap-2">
									<TTNewButton
										onClick={() =>
											handlePostReply(comment.id)
										}
									>
										Postita vastus
									</TTNewButton>
									<TTNewButton
										variant="tertiary"
										onClick={() => {
											setReplyingToCommentId(null);
											setReplyContent("");
										}}
									>
										Tühista
									</TTNewButton>
								</div>
							</div>
						)}
					</TTNewCardContent>
				</TTNewCard>

				{children.map((childNode) =>
					renderCommentNode(childNode, depth + 1),
				)}
			</div>
		);
	};

	return (
		<div className="row mt-3">
			<div>
				<Heading as="h2" visual="h4" className="mb-2">
					Kommentaarid
				</Heading>
				{commentTree.map((node) => renderCommentNode(node))}
				<ConfirmationModal
					show={commentIdToDelete !== null}
					hideAction={() => setCommentIdToDelete(null)}
					title="Kas olete kindel?"
					text="Kas soovite selle kommentaari jäädavalt kustutada? Seda toimingut ei saa tagasi võtta."
					confirmText="Jah, kustuta"
					confirmAction={() => {
						if (commentIdToDelete) {
							handleDeleteComment(commentIdToDelete);
						}
					}}
				/>
				<TTNewCard>
					<TTNewCardContent>
						<div className="d-flex flex-column gap-2">
							<Input
								as="textarea"
								placeholder="Lisa kommentaar"
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
							/>
							<TTNewButton onClick={onPostComment}>
								Postita
							</TTNewButton>
						</div>
					</TTNewCardContent>
				</TTNewCard>
			</div>
		</div>
	);
}
