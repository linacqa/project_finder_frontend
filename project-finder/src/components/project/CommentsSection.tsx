import { IComment } from "@/types/domain/IComment";
import { Heading, Input, TTNewButton, TTNewCard, TTNewCardContent } from "taltech-styleguide";

interface CommentsSectionProps {
	comments: IComment[];
	newComment: string;
	setNewComment: (value: string) => void;
	onPostComment: () => void;
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

export default function CommentsSection({ comments, newComment, setNewComment, onPostComment }: CommentsSectionProps) {
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
								{comment.user.firstName} {comment.user.lastName} ({comment.user.email})
							</small>
							<br />
							<small className="text-muted">{formatDate(comment.createdAt)}</small>
						</TTNewCardContent>
					</TTNewCard>
				))}
				<TTNewCard>
					<TTNewCardContent>
						<div className="d-flex flex-column gap-2">
							<Input
								as="textarea"
								placeholder="Lisa kommentaar"
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
							/>
							<TTNewButton onClick={onPostComment}>Postita</TTNewButton>
						</div>
					</TTNewCardContent>
				</TTNewCard>
			</div>
		</div>
	);
}
