packagee services

type Calendar interface {
	Create(ctx context.Context, value domain.Calendar) error
	FindByID(ctx context.Context, id int) (domain.Calendar, error)
	Update(ctx context.Context, value domain.Calendar) error
	Delete(ctx context.Context, id int) error
	List(ctx context.Context) ([]domain.Calendar, error)
}

type calendar struct {
	repo repositories.Calendar
}

func (s *calendar) Create(ctx context.Context, value domain.Calendar) error {
	return s.repo.Create(ctx, value)
}
func (s *calendar) FindByID(ctx context.Context, id int) (domain.Calendar, error) {
	return s.repo.FindByID(ctx, id)
}
func (s *calendar) Update(ctx context.Context, value domain.Calendar) error {
	return s.repo.Update(ctx, value)
}
func (s *calendar) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}
func (s *calendar) List(ctx context.Context) ([]domain.Calendar, error) {
	return s.repo.List(ctx)
}