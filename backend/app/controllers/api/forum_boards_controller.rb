# frozen_string_literal: true

module Api
  class ForumBoardsController < ApplicationController
    def index
      boards = ForumBoard.order(:name)
      render json: { boards: boards.map { |board| serialize_board(board) } }
    end

    def show
      board = ForumBoard.find_by!(slug: params[:slug])
      threads = board.forum_threads.includes(:user).order(bumped_at: :desc).limit(50)
      render json: {
        board: serialize_board(board),
        threads: threads.map { |thread| serialize_thread_row(thread) },
      }
    end

    private

    def serialize_board(board)
      {
        id: board.id,
        slug: board.slug,
        name: board.name,
        description: board.description,
        threadCount: board.forum_threads.count,
      }
    end

    def serialize_thread_row(thread)
      {
        id: thread.id,
        boardSlug: thread.forum_board.slug,
        subject: thread.subject,
        opBodyPreview: thread.body.truncate(280),
        authorDisplayName: thread.user.display_name,
        authorUsername: thread.user.username,
        replyCount: thread.forum_posts.count,
        createdAt: thread.created_at.iso8601(3),
        bumpedAt: thread.bumped_at.iso8601(3),
      }
    end
  end
end
