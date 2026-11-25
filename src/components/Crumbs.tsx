type Crumb = {
  label: string;
  onClick?: () => void;
};

export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {item.onClick && !last ? (
                <button type="button" className="crumb-link" onClick={item.onClick}>
                  {item.label}
                </button>
              ) : (
                <span aria-current={last ? "page" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
