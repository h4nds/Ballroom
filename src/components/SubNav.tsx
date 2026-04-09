import { useForumSounds } from "../hooks/useForumSounds";
import { useUser } from "../context/UserContext";

const items = [
  { id: "boards", label: "boards" },
  { id: "latest", label: "latest posts" },
  { id: "showcase", label: "showcase" },
  { id: "collabs", label: "collabs" },
  { id: "events", label: "events" },
] as const;

type Tab = (typeof items)[number]["id"];

type Props = {
  active: Tab;
  onChange: (t: Tab) => void;
};

export function SubNav({ active, onChange }: Props) {
  const { user } = useUser();
  const { play } = useForumSounds(user?.soundsEnabled ?? true);

  return (
    <nav className="subnav" aria-label="Sections">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`subnav-link ${active === item.id ? "is-active" : ""}`}
          aria-current={active === item.id ? "page" : undefined}
          onClick={() => {
            play("tap");
            onChange(item.id);
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
