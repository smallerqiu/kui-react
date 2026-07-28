import React from "react";

export interface MenuGroupProps {
  title: React.ReactNode;
  children?: React.ReactNode;
}

const MenuGroup: React.FC<MenuGroupProps> = ({ title, children }) => {
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const element = child as React.ReactElement<{ menuKey?: string }>;
    return React.cloneElement(element, {
      menuKey: element.props.menuKey ?? (element.key == null ? undefined : String(element.key)),
    });
  });

  return (
    <li className="k-menu-item-group">
      <div className="k-menu-item-group-title">{title}</div>
      <ul className="k-menu-item-group-list">{items}</ul>
    </li>
  );
};

export default MenuGroup;
