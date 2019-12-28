namespace :docker do
  desc 'Build the images'
  task :build do
    on roles(:all) do
      within release_path do
        execute 'docker-compose', "-f #{fetch :docker_file}", :build
      end
    end
  end

  desc 'Start the containers'
  task :up do
    on roles(:all) do
      within release_path do
        execute 'docker-compose', "-f #{fetch :docker_file}", :up, '-d'
      end
    end
  end

  desc 'Stop all the containers'
  task :down do
    on roles(:all) do
      within release_path do
        execute 'docker-compose', "-f #{fetch :docker_file}", :down
        execute 'docker stop $(docker ps -q) || true'
      end
    end
  end

  desc 'Stop all the networks'
  task :prune_networks do
    on roles(:all) do
      within release_path do
        execute 'docker', :network, :prune, '-f'
      end
    end
  end
end