import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuSeparator,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuLabel,
  ContextMenuRadioItem,
  ContextMenuShortcut,
} from "./ui/context-menu";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  TChartContextMenuRef,
  TChartContextMenuProps,
} from "./interfaces/TChartContextMenu";

const TChartContextMenu: React.ForwardRefRenderFunction<
  TChartContextMenuRef,
  TChartContextMenuProps
> = ({ setDialogVisible }, ref) => {
  const [seriesSettingsDisable, setSeriesSettingsDisable] = useState(true);

  const openSeriesSettingsDialog = () => {
    setDialogVisible(true);
  };

  useImperativeHandle(ref, () => ({
    setSeriesSettingsDisable,
  }));

  return (
    <ContextMenuContent className="w-64">
      <ContextMenuItem
        inset
        disabled={seriesSettingsDisable}
        onSelect={openSeriesSettingsDialog}
      >
        Series Settings...
        {/* <ContextMenuShortcut>⌘[</ContextMenuShortcut> */}
      </ContextMenuItem>
      <ContextMenuItem inset disabled>
        Forward
        <ContextMenuShortcut>⌘]</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem inset>
        Reload
        <ContextMenuShortcut>⌘R</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSub>
        <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
        <ContextMenuSubContent className="w-48">
          <ContextMenuItem>
            Save Page As...
            <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>Create Shortcut...</ContextMenuItem>
          <ContextMenuItem>Name Window...</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Developer Tools</ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />
      <ContextMenuCheckboxItem checked>
        Show Bookmarks Bar
        <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
      </ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
      <ContextMenuSeparator />
      <ContextMenuRadioGroup value="pedro">
        <ContextMenuLabel inset>People</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
        <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
      </ContextMenuRadioGroup>
    </ContextMenuContent>
  );
};

export default forwardRef(TChartContextMenu);