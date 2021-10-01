extern crate pest;
#[macro_use]
extern crate pest_derive;

fn main() {}
use pest::Parser;

#[cfg(test)]
mod test {
    use super::*;
    mod csv {
        use super::*;
        #[derive(Parser)]
        #[grammar = "csv.pest"]
        pub struct CSVParser;

        #[test]
        fn test_csv() {
            // parse the test file
            let f = include_str!("csv.csv");
            let file = CSVParser::parse(Rule::file, f).unwrap().next().unwrap();

            let mut sum = 0.0;
            file.into_inner().for_each(|record| {
                record.into_inner().for_each(|field| {
                    sum += field.as_str().parse::<f64>().unwrap();
                });
            });

            let error_margin = f64::EPSILON;

            assert!((2643429302.327908 - sum).abs() < error_margin);
        }
    }
    mod json {
        use super::*;
        #[derive(Parser)]
        #[grammar = "json.pest"]
        pub struct JSONParser;

        #[test]
        fn parse_json() {}

        fn serialize_json(json: &JSONValue) -> String {
            match json {
                JSONValue::Object(o) => {
                    let t = o
                        .iter()
                        .map(|v| format!("\"{}\": {}", v.0, serialize_json(&v.1)))
                        .collect::<Vec<String>>()
                        .join(",");
                    format!("{{{}}}", t)
                }
                JSONValue::Array(a) => {
                    let t = a
                        .iter()
                        .map(|v| serialize_json(v))
                        .collect::<Vec<String>>()
                        .join(",");
                    format!("[{}]", t)
                }
                JSONValue::String(s) => format!(r#""{}""#, s),
                JSONValue::Number(n) => n.to_string(),
                JSONValue::Boolean(b) => b.to_string(),
                JSONValue::Null => "null".to_string(),
            }
        }

        #[test]
        fn parse_then_serialize() {}

        // We have a lifetime here because we don't want to clone the strings that we get from the json file
        enum JSONValue<'a> {
            // You're allowed to hold a vec of enums? how
            // Objects have a `field` = `some value`
            Object(Vec<(&'a str, JSONValue<'a>)>),
            // Arrays just have `some value`
            Array(Vec<JSONValue<'a>>),
            // string is a string
            String(&'a str),
            // unconditionally store as f64?
            Number(f64),
            Boolean(bool),
            // wait you can use null in json?
            Null,
        }
    }
}
