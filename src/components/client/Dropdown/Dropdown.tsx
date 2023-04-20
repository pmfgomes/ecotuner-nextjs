"use client";

import { useEffect, useState } from "react";
import { createStyles, UnstyledButton, Menu, Text, UnstyledButtonProps, Flex } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";

export interface DropdownDataObj {
  id: string;
  label: React.ReactNode;
  value: string;
  [key: string]: unknown;
}

export interface DropdownProps {
  data?: DropdownDataObj[];
  label?: React.ReactNode;
  value?: DropdownDataObj;
  onChange?: (value: DropdownDataObj) => void;
  unstyledButtonProps?: UnstyledButtonProps;
  disabled?: boolean;
}

interface DropdownStyles {
  opened: boolean;
}

const useStyles = createStyles((theme, { opened }: DropdownStyles) => ({
  control: {
    width: "fit-content",
    minWidth: "120px",
    minHeight: "2.25rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: theme.radius.sm,
    border: `2px solid ${theme.colors.gray[0]}`,
    transition: "background-color 150ms ease",
    backgroundColor: opened ? theme.colors.primaryLighter[3] : theme.white,
    gap: "0.5rem",

    "&:hover": {
      backgroundColor: theme.colors.primaryLighter[3],
    },
  },
  active: {
    backgroundColor: theme.colors.primaryLighter[3],
  },
  activeLabel: {
    color: theme.colors.primary[9],
  },
  menuLabel: {
    color: theme.colors.gray[4],
    fontSize: theme.fontSizes.md,
  },
  menuItem: {
    "&:hover": {
      backgroundColor: theme.colors.primaryLighter[3],
    },
  },
  dropdownIcon: {
    transition: "transform 150ms ease",
    transform: opened ? "rotate(180deg)" : "rotate(0deg)",
  },
  label: {
    fontWeight: "bold",
    color: theme.colors.gray[8],
  },
  disabled: {
    cursor: "not-allowed",
    backgroundColor: theme.white,

    "&:hover": {
      backgroundColor: theme.white,
    },
  },
}));

export function Dropdown(props: DropdownProps) {
  const { data, value, onChange, label, unstyledButtonProps, disabled } = props;

  const [opened, setOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DropdownDataObj | undefined>(undefined);

  const { classes, cx } = useStyles({ opened });

  useEffect(() => {
    if (data && !selectedItem) {
      setSelectedItem(data[0]);
    }
  }, [data, selectedItem]);

  useEffect(() => {
    if (onChange && value) {
      setSelectedItem(value);
    }
  }, [value, onChange]);

  const handleSelectedItem = (item: DropdownDataObj) => {
    if (onChange) {
      onChange(item);
    }

    setSelectedItem(item);
  };

  const items = data?.map((item) => (
    <Menu.Item
      onClick={() => handleSelectedItem(item)}
      key={item.id}
      className={cx(classes.menuItem, classes.menuLabel, {
        [classes.active]: selectedItem?.id === item.id,
        [classes.activeLabel]: selectedItem?.id === item.id,
      })}
    >
      {typeof item.label === "string" ? <Text>{item.label}</Text> : item.label}
    </Menu.Item>
  ));

  const component = (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
      width="target"
      disabled={disabled}
    >
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.control, { [classes.disabled]: disabled })}
          {...unstyledButtonProps}
          disabled={disabled}
        >
          {typeof selectedItem?.label === "string" ? (
            <Text className={cx(classes.menuLabel)}>{selectedItem?.label}</Text>
          ) : (
            <span className={cx(classes.menuLabel)}>{selectedItem?.label}</span>
          )}
          <IconChevronDown size={16} className={classes.dropdownIcon} stroke={2} />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );

  return (
    <>
      {label ? (
        <Flex direction="row" wrap="nowrap" gap="xs" justify="flex-start" align="center">
          <Text className={cx(classes.label)}>{label}:</Text>
          {component}
        </Flex>
      ) : (
        component
      )}
    </>
  );
}
