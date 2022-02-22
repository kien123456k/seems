﻿using System.ComponentModel.DataAnnotations;

namespace SEEMS.DTOs
{
    public class CommentDTO
    {
        public int? Id { get; set; }
        public int? UserId { get; set; }
        public int? EventId { get; set; }
        public int? NumberReplyComment { get; set; }
        public String? CommentContent { get; set; }
        public int? ParentCommentId { get; set; }
        public string? ImageUrl { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

    }
}
