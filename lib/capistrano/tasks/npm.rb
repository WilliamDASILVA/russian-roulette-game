namespace :npm do
  desc 'Install dependencies'
  task :install do
    on roles(:all) do
      within release_path do
        execute 'docker-compose', "-f #{fetch :docker_file}", :run, 'back', 'npm ci'
        execute 'docker-compose', "-f #{fetch :docker_file}", :run, 'app', 'npm ci && npm run build'
      end
    end
  end
end