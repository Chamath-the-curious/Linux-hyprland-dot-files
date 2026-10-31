 local M = {}

function M.setup()
  require('base16-colorscheme').setup({
    base00 = '#000000',
    base01 = '#131310',
    base02 = '#1e1d19',
    base03 = '#939183',
    base04 = '#c9c7b8',
    base05 = '#e5e2db',
    base06 = '#e5e2db',
    base07 = '#e5e2db',
    base08 = '#ffb4ab',
    base09 = '#abd0ac',
    base0A = '#c9c8ac',
    base0B = '#c9ca90',
    base0C = '#abd0ac',
    base0D = '#c9ca90',
    base0E = '#c9c8ac',
    base0F = '#e6e4c7',
  })

  local hi = function(group, opts)
    vim.api.nvim_set_hl(0, group, opts)
  end

  -- telescope.nvim
  hi('TelescopeNormal',         { fg = '#e5e2db',          bg = '#000000' })
  hi('TelescopeBorder',         { fg = '#939183',             bg = '#000000' })
  hi('TelescopePromptNormal',   { fg = '#e5e2db',          bg = '#000000' })
  hi('TelescopePromptBorder',   { fg = '#939183',             bg = '#000000' })
  hi('TelescopePromptPrefix',   { fg = '#c9ca90',             bg = '#000000' })
  hi('TelescopePromptCounter',  { fg = '#c9c7b8',  bg = '#000000' })
  hi('TelescopePromptTitle',    { fg = '#000000',             bg = '#c9ca90' })
  hi('TelescopePreviewTitle',   { fg = '#000000',             bg = '#c9c8ac' })
  hi('TelescopeResultsTitle',   { fg = '#000000',             bg = '#abd0ac' })
  hi('TelescopeSelection',      { fg = '#e5e2db',          bg = '#1e1d19' })
  hi('TelescopeSelectionCaret', { fg = '#c9ca90',             bg = '#1e1d19' })
  hi('TelescopeMatching',       { fg = '#c9ca90',             bold = true })

  -- mini.pick
  hi('MiniPickNormal',         { fg = '#e5e2db',          bg = '#000000' })
  hi('MiniPickBorder',         { fg = '#939183',             bg = '#000000' })
  hi('MiniPickPrompt',   { fg = '#e5e2db',          bg = '#000000' })
  hi('MiniPickPromptPrefix',   { fg = '#c9ca90',             bg = '#000000' })
  hi('MiniPickBorderText',    { fg = '#000000',             bg = '#c9ca90' })
  hi('MiniPickMatchCurrent',      { fg = '#e5e2db',          bg = '#1e1d19' })
  hi('MiniPickPromptCaret', { fg = '#c9ca90',             bg = '#1e1d19' })
  hi('MiniPickMatchRanges',       { fg = '#c9ca90',             bold = true })
end

-- Register a signal handler for SIGUSR1 (matugen updates).
-- The handler re-requires this module, which re-runs the code below, so the
-- previous handle is stopped first; otherwise handlers double on every signal.
if _G.__matugen_signal then
  _G.__matugen_signal:stop()
  _G.__matugen_signal:close()
end

local signal = vim.uv.new_signal()
_G.__matugen_signal = signal
signal:start(
  'sigusr1',
  vim.schedule_wrap(function()
    package.loaded['matugen'] = nil
    require('matugen').setup()
  end)
)

return M
