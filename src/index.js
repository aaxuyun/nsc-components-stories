
import ColorPicker from '@/lib/components/ColorPickerPopover'
import CtxMenu from '@/lib/components/ContextMenu'
import DragM from '@/lib/components/DragMove'
import Drawer from '@/lib/components/Drawer'
import Dropdown from '@/lib/components/Dropdown'
import DynamicMountComponent from '@/lib/components/DynamicMountComponent'
import IFrame from '@/lib/components/IFrame'
import contentEditable from '@/lib/components/InlineEditComponent'
import Menu from '@/lib/components/Menu'
import PageLoading from '@/lib/components/PageLoading'
import PropertiesTable from '@/lib/components/PropertiesTable'
import TextEllipsis from '@/lib/components/TextEllipsis'
import Toolbar from '@/lib/components/Toolbar'

import Table from '@/components/Table'
import confirm from '@/components/confirm'
import LoginForm from '@/components/login/LoginForm'
import CodeVerifyForm from '@/components/login/CodeVerifyForm'
import BaseModal from '@/components/modal/BaseModal'
import page from '@/components/page/Page'
import PageToolbar from '@/components/page/PageToolbar'
import Permission from '@/components/permission/Permission'

const lib={
    ColorPicker,
    CtxMenu,
    DragM,
    Drawer,
    Dropdown,
    DynamicMountComponent,
    IFrame,
    contentEditable,
    Menu,
    PageLoading,
    PropertiesTable,
    TextEllipsis,
    Toolbar,
}
const components={Table,confirm,LoginForm,CodeVerifyForm,BaseModal,page,PageToolbar,Permission}

const NSC= {lib,components}
export default NSC

