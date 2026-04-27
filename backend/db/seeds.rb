# frozen_string_literal: true

boards = [
  { slug: "visual", name: "visual work", description: "illustration, photography, design" },
  { slug: "motion", name: "motion & film", description: "animation, video, motion graphics" },
  { slug: "music", name: "music & sound", description: "production, composition, foley" },
  { slug: "writing", name: "writing & words", description: "prose, poetry, scripts" },
  { slug: "tools", name: "tools & process", description: "software, workflows, gear" },
  { slug: "critique", name: "critique & feedback", description: "honest eyes only" },
  { slug: "collabs", name: "find collabs", description: "projects, roles, availability" },
]

boards.each do |attrs|
  ForumBoard.find_or_create_by!(slug: attrs[:slug]) do |board|
    board.name = attrs[:name]
    board.description = attrs[:description]
  end
end
