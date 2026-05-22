Gem::Specification.new do |spec|
  spec.name = "ruby_compatibility"
  spec.version = "0.1.0"
  spec.summary = "Compatibility shims for Ruby 4"
  spec.authors = ["Copilot"]
  spec.files = Dir.chdir(__dir__) { Dir["lib/**/*.rb"] }
  spec.require_paths = ["lib"]
end
