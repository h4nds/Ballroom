# frozen_string_literal: true

module Api
  class ForumBoardsController < ApplicationController
    def index
      boards = ForumBoard.order(:name).to_a
      board_ids = boards.map(&:id)

      if board_ids.empty?
        render json: { boards: [] }
        return
      end

      thread_counts = ForumThread.where(forum_board_id: board_ids).group(:forum_board_id).count
      reply_counts =
        ForumPost
          .joins(:forum_thread)
          .where(forum_threads: { forum_board_id: board_ids })
          .group("forum_threads.forum_board_id")
          .count

      latest_sql =
        ForumThread
          .where(forum_board_id: board_ids)
          .select("DISTINCT ON (forum_board_id) id")
          .order(:forum_board_id, bumped_at: :desc, id: :desc)
          .to_sql

      latest_ids = ForumThread.connection.select_values(latest_sql)
      latest_by_board =
        ForumThread.includes(:user).where(id: latest_ids).index_by(&:forum_board_id)

      render json: {
        boards: boards.map { |b| serialize_board_index(b, thread_counts, reply_counts, latest_by_board) },
      }
    end

    def show
      board = ForumBoard.find_by!(slug: params[:slug])
      threads = board.forum_threads.includes(:user).order(bumped_at: :desc).limit(50).to_a
      thread_ids = threads.map(&:id)

      reply_by_thread =
        if thread_ids.empty?
          {}
        else
          ForumPost.where(forum_thread_id: thread_ids).group(:forum_thread_id).count
        end

      thread_total = board.forum_threads.count
      reply_total =
        ForumPost.joins(:forum_thread).where(forum_threads: { forum_board_id: board.id }).count

      render json: {
        board: serialize_board_show(board, thread_count: thread_total, post_count: thread_total + reply_total),
        threads: threads.map { |t| serialize_thread_row(t, board.slug, reply_by_thread.fetch(t.id, 0)) },
      }
    end

    private

    def serialize_board_index(board, thread_counts, reply_counts, latest_by_board)
      tc = thread_counts[board.id] || 0
      rc = reply_counts[board.id] || 0
      h = {
        id: board.id,
        slug: board.slug,
        name: board.name,
        description: board.description,
        threadCount: tc,
        postCount: tc + rc,
      }
      lt = latest_by_board[board.id]
      if lt
        h[:latestSubject] = lt.subject
        h[:latestAuthorDisplayName] = lt.user.display_name
        h[:latestBumpedAt] = lt.bumped_at.iso8601(3)
      end
      h
    end

    def serialize_board_show(board, thread_count:, post_count:)
      {
        id: board.id,
        slug: board.slug,
        name: board.name,
        description: board.description,
        threadCount: thread_count,
        postCount: post_count,
      }
    end

    def serialize_thread_row(thread, board_slug, reply_count)
      {
        id: thread.id,
        boardSlug: board_slug,
        subject: thread.subject,
        opBodyPreview: thread.body.truncate(280),
        authorDisplayName: thread.user.display_name,
        authorUsername: thread.user.username,
        replyCount: reply_count,
        createdAt: thread.created_at.iso8601(3),
        bumpedAt: thread.bumped_at.iso8601(3),
      }
    end
  end
end
