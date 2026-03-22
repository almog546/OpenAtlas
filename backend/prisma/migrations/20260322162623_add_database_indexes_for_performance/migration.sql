-- CreateIndex
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

-- CreateIndex
CREATE INDEX "Bookmark_postId_idx" ON "Bookmark"("postId");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "Comment_authorId_idx" ON "Comment"("authorId");

-- CreateIndex
CREATE INDEX "Draft_authorId_idx" ON "Draft"("authorId");

-- CreateIndex
CREATE INDEX "Follow_followerId_idx" ON "Follow"("followerId");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_actorId_idx" ON "Notification"("actorId");

-- CreateIndex
CREATE INDEX "Notification_postId_idx" ON "Notification"("postId");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "postHistory_postId_idx" ON "postHistory"("postId");

-- CreateIndex
CREATE INDEX "postHistory_authorId_idx" ON "postHistory"("authorId");

-- CreateIndex
CREATE INDEX "reply_commentId_idx" ON "reply"("commentId");

-- CreateIndex
CREATE INDEX "reply_authorId_idx" ON "reply"("authorId");

-- CreateIndex
CREATE INDEX "report_reporterId_idx" ON "report"("reporterId");

-- CreateIndex
CREATE INDEX "report_postId_idx" ON "report"("postId");
