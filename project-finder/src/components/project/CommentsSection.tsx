import { AccountContext } from "@/context/AccountContext";
import { IComment } from "@/types/domain/IComment";
import { useContext, useState } from "react";
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
	onDelete: (commentId: string) => void;
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
	onDelete,
}: CommentsSectionProps) {
	const { accountInfo } = useContext(AccountContext);
	const [commentIdToDelete, setCommentIdToDelete] = useState<string | null>(
		null,
	);

	const handleDeleteComment = (commentId: string) => {
		setCommentIdToDelete(null);
		onDelete(commentId);
	};

	return (
		<div className="row mt-3">
			<div>
				<Heading as="h2" visual="h4" className="mb-2">
					Kommentaarid
				</Heading>
				{comments.map((comment) => (
					<TTNewCard key={comment.id} className="mb-2">
						<TTNewCardContent>
							<p>{comment.content}</p>
							<small className="text-muted">
								{comment.user.firstName} {comment.user.lastName}{" "}
								({comment.user.email})
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
						</TTNewCardContent>
					</TTNewCard>
				))}
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
