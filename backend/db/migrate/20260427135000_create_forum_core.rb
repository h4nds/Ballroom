# frozen_string_literal: true

class CreateForumCore < ActiveRecord::Migration[8.0]
  def change
    create_table :forum_boards do |t|
      t.string :slug, null: false
      t.string :name, null: false
      t.string :description, null: false, default: ""

      t.timestamps
    end
    add_index :forum_boards, :slug, unique: true

    create_table :forum_threads do |t|
      t.references :forum_board, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :subject, null: false
      t.text :body, null: false
      t.datetime :bumped_at, null: false

      t.timestamps
    end
    add_index :forum_threads, %i[forum_board_id bumped_at]

    create_table :forum_posts do |t|
      t.references :forum_thread, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :body, null: false

      t.timestamps
    end
    add_index :forum_posts, %i[forum_thread_id created_at]
  end
end
