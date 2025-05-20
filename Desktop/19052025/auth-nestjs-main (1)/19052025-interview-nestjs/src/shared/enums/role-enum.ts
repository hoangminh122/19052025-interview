enum Role {
    User = 'user',
    Admin = 'admin'
}

// Role table
enum TypeRole {
    SUPER_ADMIN = 'SUPER_ADMIN',            //High
    PIC_ADMIN = 'SUB_ADMIN',                 //Middle     
    USER = 'USER'                           //Normal
}

// Permission Table
enum TypePermission {
    MASTER = 'MASTER',                                 // 
    BRANCH_MANAGER = 'BRANCH_MANAGER',               // Role with BRANCH
    DEPARTMENT_MANAGER= 'DEPARTMENT_MANAGER',       // Role with DEPARTMENT
    ADMIN_GROUP_USER = 'ADMIN_GROUP_USER',          // Role with group chat user
    USER= 'USER'
}

export {
    Role,
    TypeRole,
    TypePermission
}