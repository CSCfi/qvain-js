# Scripts for updating the front-end schema

These scripts are used to produce the schema files to be used in the front-end.
To update the schema files, run the following commands:

```
./get_schema_from_metax.sh                  # download latest schemas from metax to data directory
node process_schemas.js ../../src/schemas  # edit and dereference schemas, save to schema directory (overwrite existing)
```

It's recommended to do a backup so you can compare changes. To compare schema files, use:
```
node compare_schemas.js old_schema new_schema
```
