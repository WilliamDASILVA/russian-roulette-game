namespace :npm do
  desc 'Install dependencies'
  task :install do
    on roles(:all) do
      within release_path do
        execute 'docker-compose', "-f #{fetch :docker_file}", :run, 'back', 'npm ci'
        execute 'docker-compose', "-f #{fetch :docker_file}", :run, 'app', 'npm ci'
      end
    end
  end

  desc 'Build project'
  task :build do
    on roles(:all) do
      within release_path do
        execute 'docker-compose', "-f #{fetch :docker_file}", :run, 'app', 'npm run build'
      end
    end
  end
end