# JSON Format Specification

## Type definition rule

1. `data` is the root type.
2. The type of an object is defined as `obj0 = { field0, field1 }`. The type of its field is refered as `obj0.field0`.
3. When applying the definition of an object, the field refers to the corresponding string as the key. For example, an instance of `obj0 = { field0 = Number, field1 = Bool }` would be `{ "field0": 0, "field1": true }`.
4. The type of an array is defined as `arr0 = [ elem0 ]`. The type of its element is refered as `arr0.[elem0]`. Note that all elements of the same array should have the same type. i.e. `[1, true, "god"]` is illegal.
5. Basic types are noted with capital letter. That is one of `String`, `Number`, `Boolean`, `Array`, `Object` and `Null`. (don't actually use `Null`, it's pure evil.)
6. The enumeration values of a given type is defined like `enum0 = String ( "foo" | "bar" )`.
7. Comments begin with `--` and expand to the end of the line.
8. The definition may be recursively expanded or it can appear as a new top level definition.
9. `other` is a valid field for all objects. We use this field to implement extensions.
10. `prefix a` will add `a.` to all top level definition in a given block. `prefix *` will treat every top level definition in the same block above the statement as a prefix to all definitions below the statement.
11. `Encode t` means the current field is a string encoding of the enumeration object type `t`. For example, if we have `duck_reaction = Object ( quack | fly | swim )`, then `duck_reaction_type = Encode duck_reaction` means `duck_reaction_type = String ( "quack" | "fly" | "swim" )`

## Definitions

### Root

```haskell
data = {
  dir = String ( "request" | "response" ),
  signature,
  type = Encode content,
  content = Object ( account
                   | lab
                   | project
                   | seminar
                   | comment
                   -- | interaction -- maybe later for SNS
                   )
}
```

User signature

```haskell
prefix *

signature = {
  is_user = Boolean,     -- false means a guest
                         -- the following fields are valid if is_user == true
  user_email = String,   -- email format
  password_hash = String -- hash value format
}
```

### Account

```haskell
prefix data.content

account = {
  action = Encode data
  data = Object ( login
                | register
                | validate
                | reset_password
                | edit
                | delete
                | view
                )
}
```

#### Request

```haskell
when data.dir == "request"
prefix data.content.account.data

login = { }

-- data.signature.is_user == true in registering
register = { bio }

validate = {
  issue_new = Boolean,
  validation = String -- validation format
             -- empty: when issue_new == true, that is to send or resend an email
             -- non-empty: actual validation string
}

reset_password = { }

edit = { bio }

delete = { }

view = { } -- request to view a given account's view
```

#### Response

```haskell
when data.dir == "response"
prefix data.content.account.data

login = {
  status = Number ( 0 -- success
                  | 1 -- wrong password
                  | 2 -- account not found
                  | 3 -- other failure
                  )
}

register = {
  status = Number ( 0 -- success
                  | 1 -- email already registered
                  | 2 -- other failure
                  )
}

validate = {
  status = Number ( 0 -- success
                  | 1 -- wrong validation
                  | 2 -- other failure
                  )
}

reset_password = {
  status = Number ( 0 -- success
                  | 1 -- no such account
                  | 2 -- other failure
                  )
}

reset_password = {
  status = Number ( 0 -- success
                  | 1 -- no such account
                  | 2 -- other failure
                  )
}

edit = {
  status = Number ( 0 -- success
                  | 1 -- failure
                  )
}

delete = {
  status = Number ( 0 -- success
                  | 1 -- failure
                  )
}

view = {
  status = Number ( 0 -- success
                  | 1 -- no such user
                  | 2 -- other failure
                  ),
  bio
}
```

#### Common definitions

```haskell
prefix *

password_hash = String

bio = {
  real_name = String,
  nick_name = String,
  pic_url = String,         -- url format
  school = String,
  department = String,
  type = String ( "Teacher"
                | "Undergraduate"
                | "Master"
                | "PhD"
                | "other"
                ),
  enrollment_year = Number, -- year format
  -- when registering, the following four fields need to be empty
  labs = [ lab_id = Number ], -- if the lab is on site
  projects = [ project_id = Number ],
  seminars = [ seminar_id = Number ],
  comments = [ comment_id = Number ],
  profile = String          -- markdown format
}
```

### Lab

```haskell
prefix data.content

lab = {
  id = Number,  -- when creating, id == -1
  action = Encode data,
  data = Object ( create | edit | delete | view )
}
```

#### Request

```haskell
when data.dir == "request"
prefix data.content.lab.data

create = { lab_info }

edit = { lab_info }

delete = { }

view = { }
  
```

#### Response

```haskell
when data.dir == "response"
prefix data.content.lab.data

create = { status }

edit = { status }

delete = { status }

view = {
  status = Number ( 0 -- success
                  | 1 -- no such lab
                  | 2 -- other failure
                  ),
  lab_info
}

status = Number ( 0 -- success
                | 1 -- invalid account
                | 2 -- permission denied
                | 3 -- other failure
                )
```

#### Common definitions

```haskell
prefix *

user_email = String -- email format

lab_info = {
  id = Number,  -- when creating, id == -1
  name = String,
  school = String,
  department = String,
  -- when creating, "", use upper definition
  owner_email = user_email,
  address = String,
  phone = String,          -- phone format
  front_page_url = String, -- url format
  pic_url = String,        -- url format, picture of members
  logo_url = String,       -- url format
  supervisors = [ lab_bio ],
  comments = [ comment_id = Number ],
  description = String     -- markdown format
}

lab_bio = {
  name = String,
  school = String,
  department = String,
  title = String,
  pic_url = String,          -- url format
  is_user = Boolean,         -- if the person has an account
  -- the account can be obtained from here
  account_email = String ( ""         when is_user == false
                         | user_email when is_user == true
                         ),
  contact_email = String,    -- can be different from account_email
  address = String,
  profile = String           -- markdown format
}
```

### Project

```haskell
prefix data.content

project = {
  id = Number,  -- when creating, id == -1
  action = Encode data,
  data = Object ( create | edit | delete | view | join | drop )
}
```

#### Request

```haskell
when data.dir == "request"
prefix data.content.project.data

create = { project_info }

edit = { project_info }

delete = { }

view = { }

join = { }

drop = { }
```

#### Response

```haskell
when data.dir == "response"
prefix data.content.project.data

create = { status }

edit = { status }

delete = { status }

view = {
  status = Number ( 0 -- success
                  | 1 -- no such project
                  | 2 -- other failure
                  ),
  project_info
}

join = {
  status = Number ( 0 -- success
                  | 1 -- invalid account
                  | 2 -- already outdated
                  | 3 -- already full
                  | 4 -- other failure
                  )
}

drop = { status }

status = Number ( 0 -- success
                | 1 -- invalid account
                | 2 -- permission denied
                | 3 -- other failure
                )
```

#### Common definitions

```haskell
prefix *

user_email = String -- email format

project_info = {
  id = Number,
  name = String,
  owner = user_email,
  start_date = String,  -- date format
  end_date = String,    -- date format
  member_total_need = Number,
  current_members = [ user_email ],
  comments = [ comment_id = Number ],
  description = String, -- markdown format
}
```

### Seminar

```haskell
prefix data.content

seminar = {
  id = Number,  -- when creating, id == -1
  action = Encode data,
  data = Object ( create | edit | delete | view | join | drop )
}
```

#### Request

```haskell
when data.dir == "request"
prefix data.content.seminar.data

create = { seminar_info }

edit = { seminar_info }

delete = { }

view = { }

join = { }

drop = { }
```

#### Response


```haskell
when data.dir == "response"
prefix data.content.seminar.data

create = { status }

edit = { status }

delete = { status }

view = {
  status = Number ( 0 -- success
                  | 1 -- no such seminar
                  | 2 -- other failure
                  ),
  seminar_info
}

join = {
  status = Number ( 0 -- success
                  | 1 -- invalid account
                  | 2 -- already outdated
                  | 3 -- already full
                  | 4 -- other failure
                  )
}

drop = { status }

status = Number ( 0 -- success
                | 1 -- invalid account
                | 2 -- permission denied
                | 3 -- other failure
                )
```

#### Common definitions

```haskell
prefix *

user_email = String  -- email format

seminar_info = {
  id = Number,       -- when creating, id == -1
  name = String,
  owner = user_email,
  date = String,     -- date format
  duration = String, -- time period format
  member_number_limit = Number,
  current_members = [ user_email ],
  comments = [ comment_id = Number ],
  description = String -- markdown format
}
```

### Comment

```haskell
prefix data.content

comment = {
  id = Number,  -- when creating, id == -1
  action = Encode data,
  data = Object ( create | edit | delete | view )
}
```

#### Request

```haskell
when data.dir == "request"
prefix data.content.comment.data

create = {
  target = Number ( 0 -- lab
                  | 1 -- project
                  | 2 -- seminar
                  | 3 -- comment
                  | 4 -- other
                  ),
  target_id = Number,
  content = String  -- markdown format
}

edit = {
  content = String  -- markdown format
}

delete = { }

view = { }
```

#### Response

```haskell
when data.dir == "response"
prefix data.content.comment.data

create = { status }

edit = { status }

delete = { status }

view = {
  status = Number ( 0 -- success
                  | 1 -- no such comment
                  | 2 -- other failure
                  ),
  user_email = String, -- email format
  sub_comments = [ comment_id = Number ],
  content = String -- markdown format
}

status = Number ( 0 -- success
                | 1 -- invalid account
                | 2 -- permission denied
                | 3 -- other failure
                )
```
