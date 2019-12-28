set :application, 'Bombparty'

set :deploy_to, '/var/www/bombparty'

set :repo_url, "git@github.com:WilliamDASILVA/bombparty.git"

role :server, %w{root@178.62.12.76}

after 'deploy:updated', 'docker:down'
after 'deploy:updated', 'docker:prune_networks'
after 'deploy:updated', 'docker:build'
after 'deploy:updated', 'npm:install'
after 'deploy:updated', 'npm:build'
after 'deploy:updated', 'docker:up'
