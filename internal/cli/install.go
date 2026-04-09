package cli

import (
	"fmt"

	"github.com/firemanxbr/cnpg-console/internal/checks"
	"github.com/firemanxbr/cnpg-console/internal/helm"
	"github.com/spf13/cobra"
)

func NewInstallCmd() *cobra.Command {
	var (
		namespace  string
		valuesFile string
		skipChecks bool
	)
	cmd := &cobra.Command{
		Use:   "install",
		Short: "Run preflight checks and install CNPG Console via Helm",
		RunE: func(cmd *cobra.Command, args []string) error {
			if !skipChecks {
				fmt.Println("Running preflight checks...")
				if err := checks.RunAll(); err != nil {
					return fmt.Errorf("preflight checks failed: %w", err)
				}
				fmt.Println("All checks passed.")
				fmt.Println()
			}

			fmt.Println("Installing CNPG Console...")
			if err := helm.Install(namespace, valuesFile); err != nil {
				return fmt.Errorf("installation failed: %w", err)
			}
			fmt.Println("CNPG Console installed successfully!")
			fmt.Printf("  Namespace: %s\n", namespace)
			fmt.Println()
			fmt.Println("Next steps:")
			fmt.Println("  kubectl port-forward svc/cnpg-console 8080:8080 -n " + namespace)
			fmt.Println("  Open http://localhost:8080")
			return nil
		},
	}
	cmd.Flags().StringVarP(&namespace, "namespace", "n", "cnpg-console", "Target namespace")
	cmd.Flags().StringVarP(&valuesFile, "values", "f", "", "Path to values.yaml override")
	cmd.Flags().BoolVar(&skipChecks, "skip-checks", false, "Skip preflight checks")
	return cmd
}
